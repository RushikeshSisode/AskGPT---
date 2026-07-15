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
    <div className="h-full overflow-y-auto px-4 py-5 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-500">
              Gallery
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Community images</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
              Explore published image generations from your workspace community.
            </p>
          </div>
          <div className="app-card rounded-[24px] px-5 py-4 text-sm text-slate-300">
            {images.length} published {images.length === 1 ? "image" : "images"}
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
                className="app-card group block overflow-hidden rounded-[28px] p-3 transition duration-200 hover:-translate-y-1 hover:border-white/16"
              >
                <div className="overflow-hidden rounded-[22px]">
                  <img
                    src={item.imageUrl}
                    alt="Community"
                    className="h-72 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                  />
                </div>

                <div className="flex items-center justify-between gap-3 px-1 pb-1 pt-4">
                  <div>
                    <p className="text-sm font-medium text-slate-100">{item.userName || "Anonymous"}</p>
                    <p className="mt-1 text-xs text-slate-500">Open full resolution</p>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">
                    Published
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="app-card rounded-[28px] px-6 py-10 text-center">
            <p className="text-lg font-medium text-white">No images available yet</p>
            <p className="mt-2 text-sm text-slate-400">
              Generate an image and publish it to make the gallery come alive.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;
