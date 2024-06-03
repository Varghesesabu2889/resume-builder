import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { getTemplates } from "../api";

const useTemplate = () => {
  const { data, isLoading, isError, refetch } = useQuery(
    "templates",
    async () => {
      try {
        const templates = await getTemplates();
        return templates;
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong");
        throw err; 
      }
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  return {
    data,
    isLoading,
    isError,
    refetch,
  };
};

export default useTemplate;
