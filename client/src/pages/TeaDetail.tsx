import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_TEA } from "../utils/queries";

function TeaDetail() {
  const { id } = useParams<{ id: string }>();
  const { loading, error, data } = useQuery(GET_TEA, {
    variables: { id },
  });

  if (loading)
    return <p className="text-center text-gray-500">Loading tea details...</p>;
  if (error)
    return (
      <p className="text-center text-red-500">
        Error loading tea: {error.message}
      </p>
    );

  const tea = data?.tea;
  if (!tea) return <p className="text-center text-gray-500">Tea not found!</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl border border-gray-200">
      <h1 className="text-3xl font-bold mb-4 text-emerald-700">{tea.name}</h1>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {tea.imageUrl && (
          <img
            src={tea.imageUrl}
            alt={tea.name}
            className="w-full md:w-60 rounded-xl shadow-md object-cover"
          />
        )}

        <div className="flex-1 space-y-3 text-gray-700">
          <p>
            <span className="font-semibold">Brand:</span> {tea.brand}
          </p>
          <p>
            <span className="font-semibold">Type:</span> {tea.type}
          </p>
          {tea.tastingNotes && (
            <p>
              <span className="font-semibold">Tasting Notes:</span>{" "}
              {tea.tastingNotes}
            </p>
          )}
          {tea.tags?.length > 0 && (
            <p>
              <span className="font-semibold">Tags:</span> {tea.tags.join(", ")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeaDetail;
