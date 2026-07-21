import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "./Loading";
import API_BASE_URL from "../config/apiBaseUrl";

const Community = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/users/published-images`);
        if (response.data.success) {
          setImages(response.data.images);
        }
      } catch (error) {
        console.error("Fetch Community Images Error:", error?.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="h-full overflow-y-auto px-6 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--app-text-soft)]">
              Gallery
            </p>
            <h1 className="mt-2 text-3xl font-medium text-[var(--app-text)]">Community</h1>
            <p className="mt-3 max-w-2xl text-sm text-[var(--app-text-soft)]">
              Published images from users.
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] px-5 py-4 text-sm text-[var(--app-text)]">
            {images.length} {images.length === 1 ? "image" : "images"}
          </div>
        </div>

        {images.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {images.map((item, index) => (
              <a
                key={`${item.imageUrl}-${index}`}
                href={item.imageUrl}
                target="_blank"
                rel="noreferrer"
                className="block rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] p-3"
              >
                <img
                  src={item.imageUrl}
                  alt="Community"
                  className="h-72 w-full rounded-xl object-cover"
                />

                <div className="pt-4">
                  <p className="text-sm text-[var(--app-text)]">{item.userName || "Anonymous"}</p>
                  <p className="mt-1 text-xs text-[var(--app-text-soft)]">Open full image</p>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] px-6 py-10 text-center">
            <p className="text-lg text-[var(--app-text)]">No images available yet</p>
            <p className="mt-2 text-sm text-[var(--app-text-soft)]">
              Generate and publish an image to show it here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;
