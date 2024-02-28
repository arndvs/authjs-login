import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  // get the current user role
  const role = await currentRole();

  // if the user is an admin, return a 200
  if (role === UserRole.ADMIN) {
    return new NextResponse(null, { status: 200 });
  }

  // if the user is not an admin, return a 403
  return new NextResponse(null, { status: 403 });
}
