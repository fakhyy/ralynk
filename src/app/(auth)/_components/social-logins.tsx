import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { toastManager } from "@/components/ui/toast";
import { GithubIcon, GoogleIcon } from "@/components/ui/svgs";

export function SocialLogins() {
  async function handleOAuth(provider: "github" | "google") {
    try {
      authClient.signIn.social(
        { provider },
        {
          onSuccess: ({ data }) => {
            console.log(data);
          },
          onError: ({ error }) => {
            toastManager.add({
              title: error.message,
              type: "error",
            });
          },
        },
      );
    } catch {
      toastManager.add({
        title: "OAuth sign in failed",
        type: "error",
      });
    }
  }

  return (
    <>
      <div className="relative mt-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">or</span>
        </div>
      </div>

      <div className="space-y-2">
        <Button
          size="lg"
          variant="outline"
          className="w-full"
          onClick={() => handleOAuth("github")}
        >
          <GithubIcon />
          Continue with GitHub
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="w-full"
          onClick={() => handleOAuth("google")}
        >
          <GoogleIcon />
          Continue with Google
        </Button>
      </div>
    </>
  );
}
