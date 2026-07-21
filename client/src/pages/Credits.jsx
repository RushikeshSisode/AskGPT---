import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import Loading from "./Loading";
import API_BASE_URL from "../config/apiBaseUrl";

const Credits = () => {
  const { user, setUser } = useAppContext();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/payments/plans`);
        if (response.data.success) {
          setPlans(response.data.plans);
        }
      } catch (error) {
        console.error("Fetch Plans Error:", error);
        toast.error("Unable to load plans right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const buyPlan = async (planId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/api/payments/purchase`,
        { planId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.data.success) return;

      const { orderId, amount, razorpay_key, transactionId } = response.data;

      const options = {
        key: razorpay_key,
        amount: amount * 100,
        currency: "INR",
        name: "AskGPT",
        description: "Credit Purchase",
        order_id: orderId,
        handler: async (paymentResponse) => {
          const verify = await axios.post(
            `${API_BASE_URL}/api/payments/verify`,
            {
              ...paymentResponse,
              transactionId,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (verify.data.success) {
            setUser((prev) => ({
              ...prev,
              credits: prev.credits + verify.data.addedCredits,
            }));
            toast.success("Credits added successfully.");
          }
        },
        theme: { color: "#1976D2" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Payment could not be started.");
      console.error("Payment Error:", error);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="h-full overflow-y-auto px-6 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--app-text-soft)]">
              Billing
            </p>
            <h1 className="mt-2 text-3xl font-medium text-[var(--app-text)]">Credits</h1>
            <p className="mt-3 max-w-2xl text-sm text-[var(--app-text-soft)]">
              Choose a plan to add more credits.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] px-5 py-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--app-text-soft)]">
              Available credits
            </p>
            <p className="mt-2 text-3xl font-medium text-[var(--app-text)]">
              {user?.credits ?? 0}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan._id} className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] p-6">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-medium text-[var(--app-text)]">{plan.name}</h3>
                  <p className="mt-2 text-sm text-[var(--app-text-soft)]">
                    {plan.credits} generation credits
                  </p>
                </div>
                <span className="rounded-xl border border-[var(--app-border)] px-3 py-1 text-xs text-[var(--app-primary)]">
                  Rs. {plan.price}
                </span>
              </div>

              <p className="mb-6 text-sm text-[var(--app-text-soft)]">
                Suitable for regular AI text and image usage.
              </p>

              <ul className="mb-6 space-y-3 text-sm text-[var(--app-text)]">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="mt-0.5 text-[var(--app-primary)]">+</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => buyPlan(plan._id)}
                className="w-full rounded-xl bg-[var(--app-primary)] px-4 py-3 text-sm font-medium text-[var(--app-primary-text)]"
              >
                Buy plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Credits;
