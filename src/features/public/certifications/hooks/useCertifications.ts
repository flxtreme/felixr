import useSWR from "swr";
import { getCertifications } from "@/src/features/public/certifications/services";
import type { GetCertificationsQuery } from "@/src/features/public/certifications/types";

const useCertifications = (params?: GetCertificationsQuery) => {
  const swr = useSWR(["certifications", params], () => getCertifications(params));

  return {
    ...swr,
    certifications: swr.data?.data ?? [],
    meta: swr.data?.meta,
    isLoading: swr.isLoading,
  };
};

export default useCertifications;
