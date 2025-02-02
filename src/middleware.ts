import { NextRequest, NextResponse } from "next/server";
import jwt_decode from "jwt-decode";
interface decodedTokenProps {
  role?: string;
  _id?: string;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const userAccessToken = req.cookies.get("refreshToken");

  let decodedToken: decodedTokenProps | null = null;

  if (userAccessToken) decodedToken = jwt_decode(userAccessToken?.value);

  if (pathname === "/login" && userAccessToken)
    return NextResponse.redirect(
      new URL(decodedToken?.role == "ADMIN" ? "/admin/judges" : "/", req.url)
    );

  if (
    pathname.includes("admin") &&
    userAccessToken &&
    decodedToken &&
    decodedToken?.role !== "ADMIN"
  )
    return NextResponse.redirect(new URL("/", req.url));

  if (
    pathname === "/" &&
    userAccessToken &&
    decodedToken &&
    decodedToken?.role !== "JUDGE"
  )
    return NextResponse.redirect(new URL("/admin/judges", req.url));


  return NextResponse.next(); // Continue to the next middleware
}
