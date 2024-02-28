"use client";

import { admin } from "@/actions/admin";
import { RoleGate } from "@/components/auth/role-gate";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserRole } from "@prisma/client";
import { toast } from "sonner";

const AdminPage = () => {


    const onApiRouteClick = () => {
        // fetch the admin API route
        fetch("/api/admin")
        // show a success message if the route is allowed
          .then((response) => {
            // if the response is ok, show a success message
            if (response.ok) {
              toast.success("Allowed API Route!");
              // if the response is not ok, show an error message
            } else {
              toast.error("Forbidden API Route!");
            }
          })
      }

      const onServerActionClick = () => {
        // call the admin function from the admin action
        admin()
        // data is returned from the server action
          .then((data) => {
            // if there is an error, show an error message
            if (data.error) {
              toast.error(data.error);
            }

            if (data.success) {
              toast.success(data.success);
            }
          })
      }

    return (
        <Card className="w-[600px]">
        <CardHeader>
          <p className="text-2xl font-semibold text-center">
            🔑 Admin
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <RoleGate allowedRole={UserRole.ADMIN}>
            <FormSuccess
              message="You are allowed to see this content!"
            />
          </RoleGate>
          <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
            <p className="text-sm font-medium">
              Admin-only API Route
            </p>
            <Button onClick={onApiRouteClick}>
              Click to test
            </Button>
          </div>

          <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
            <p className="text-sm font-medium">
              Admin-only Server Action
            </p>
            <Button onClick={onServerActionClick}>
              Click to test
            </Button>
          </div>
        </CardContent>
      </Card>
    );

}

export default AdminPage;
