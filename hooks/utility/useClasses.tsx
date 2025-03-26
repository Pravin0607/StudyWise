import { useEffect } from "react";
import useClassStore from "@/store/useClassStore";

const useClasses = () => {
    const { classes: classList, fetchClasses, isLoading } = useClassStore();

    useEffect(() => {
        fetchClasses();
    }, [fetchClasses]);

    return { classList, fetchClasses, isLoading };
};

export default useClasses;