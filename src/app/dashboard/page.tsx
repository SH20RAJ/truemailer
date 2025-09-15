"use client";

import { useUser } from "@stackframe/stack";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AuthButtons } from "@/components/auth-buttons";
import { Calendar, Mail, User, Shield, Clock } from "lucide-react";

export default function Dashboard() {
  const user = useUser();

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">User Dashboard</h1>
          <p className="text-muted-foreground mb-6">
            Please sign in to access your dashboard
          </p>
          <AuthButtons />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome back!</h1>
            <p className="text-muted-foreground">
              Here&apos;s your account information
            </p>
          </div>
          <AuthButtons />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Card */}
          <Card className="col-span-full md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Your account details from StackAuth
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                {user.profileImageUrl && (
                  <img
                    src={user.profileImageUrl}
                    alt="Profile"
                    className="w-16 h-16 rounded-full border-2 border-primary/20"
                  />
                )}
                <div>
                  <h3 className="font-semibold text-lg">
                    {user.displayName || "No name set"}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    ID: {user.id}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Email Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-medium">{user.primaryEmail}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={user.primaryEmailVerified ? "default" : "secondary"}>
                    {user.primaryEmailVerified ? "Verified" : "Unverified"}
                  </Badge>
                  {user.primaryEmailVerified && (
                    <Shield className="w-4 h-4 text-green-500" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Account Type</span>
                <Badge variant="outline">Standard</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Member Since</span>
                <span className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Session Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Session Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium mb-1">Current Session</p>
                <Badge variant="outline" className="text-xs">
                  Active
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  You are successfully authenticated with StackAuth
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Metadata Cards */}
        {user.clientMetadata && (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {user.clientMetadata && (
              <Card>
                <CardHeader>
                  <CardTitle>Client Metadata</CardTitle>
                  <CardDescription>Data stored on the client side</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-muted p-3 rounded overflow-auto">
                    {JSON.stringify(user.clientMetadata, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}

            {user.clientMetadata && (
              <Card>
                <CardHeader>
                  <CardTitle>Client Metadata</CardTitle>
                  <CardDescription>Additional user data</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-muted p-3 rounded overflow-auto">
                    {JSON.stringify(user.clientMetadata, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* API Test */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>API Test</CardTitle>
            <CardDescription>
              Test the authentication API endpoints
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Visit <code className="bg-muted px-2 py-1 rounded">/test-auth</code> to test 
              database integration and API endpoints.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}