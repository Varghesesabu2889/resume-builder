import { useQuery } from "react-query";

const useFilter =()=>{
const {data,isLoading,isError,refetch} = useQuery(
"globalFilter",
() => ({searchTerm:""}), //using a function the initial data
    {refetchOnWindowFocus:false}
)
return{data,isLoading,isError,refetch}
}
export default useFilter;