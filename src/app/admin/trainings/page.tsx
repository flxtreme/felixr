import { Suspense } from "react";
import AdminResourcePage from "@/src/views/admin/resources/AdminResourcePage";

export default function Page() {
  return <Suspense fallback={null}><AdminResourcePage resource="trainings" /></Suspense>;
}
