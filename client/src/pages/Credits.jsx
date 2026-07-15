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
        name: "AskVision",
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
        theme: { color: "#3B82F6" },
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
    <div className="h-full overflow-y-auto px-4 py-5 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-500">
              Billing
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Upgrade your workspace</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
              Purchase credits for text and image generation without leaving your workflow.
            </p>
          </div>

          <div className="app-card rounded-[24px] px-5 py-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Available credits</p>
            <p className="mt-2 text-3xl font-semibold text-white">{user?.credits ?? 0}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan._id} className="app-card rounded-[28px] p-6">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-semibold text-white">{plan.name}</h3>
                  <p className="mt-2 text-sm text-slate-400">{plan.credits} generation credits</p>
                </div>
                <span className="rounded-full border border-blue-400/25 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-200">
                  ₹{plan.price}
                </span>
              </div>

              <p className="mb-6 text-sm leading-7 text-slate-400">
                Ideal for users who want reliable access to premium AI responses and image generation.
              </p>

              <ul className="mb-6 space-y-3 text-sm text-slate-300">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                      ✓
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => buyPlan(plan._id)}
                className="app-button app-button-primary w-full rounded-2xl px-4 py-3 text-sm font-semibold"
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Credits;
