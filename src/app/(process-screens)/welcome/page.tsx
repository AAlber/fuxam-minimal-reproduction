
import { CardDescription, CardHeader, CardTitle } from "@/src/app/ui/card";
import WelcomeButtons from "./components/welcome-buttons";

export type Language = "en" | "de";
export default async function WelcomePage({
  params: { lang },
  searchParams,
}: {
  params: { lang: Language };
  searchParams: { redirect_url?: string };
}) {

  return (
    <>
      <div className="w-full grow items-center">
        <CardHeader className="text-center">
          <CardTitle>{"title"}</CardTitle>
          <CardDescription>{"description"}</CardDescription>
        </CardHeader>
        <WelcomeButtons params={{ lang }} />
      </div>
    </>
  );
}
