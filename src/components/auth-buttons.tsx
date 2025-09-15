"use client";

import { useUser, useStackApp } from "@stackframe/stack";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, UserPlus } from "lucide-react";

export function AuthButtons() {
  const user = useUser();
  const app = useStackApp();

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <img
            src={user.profileImageUrl || "/default-avatar.png"}
            alt={user.displayName || "User"}
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm font-medium">
            {user.displayName || user.primaryEmail}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => user.signOut()}
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => app.redirectToSignIn()}
        className="flex items-center gap-2"
      >
        <LogIn className="w-4 h-4" />
        Sign In
      </Button>
      <Button
        size="sm"
        onClick={() => app.redirectToSignUp()}
        className="flex items-center gap-2"
      >
        <UserPlus className="w-4 h-4" />
        Sign Up
      </Button>
    </div>
  );
}

export function SignInButton() {
  const app = useStackApp();
  
  return (
    <Button
      onClick={() => app.redirectToSignIn()}
      className="flex items-center gap-2"
    >
      <LogIn className="w-4 h-4" />
      Sign In
    </Button>
  );
}

export function SignUpButton() {
  const app = useStackApp();
  
  return (
    <Button
      onClick={() => app.redirectToSignUp()}
      className="flex items-center gap-2"
    >
      <UserPlus className="w-4 h-4" />
      Sign Up
    </Button>
  );
}