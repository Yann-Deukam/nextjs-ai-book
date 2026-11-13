"use client";

import {
    Show,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

import { navItems } from "@/constants";
import { cn } from "@/lib/utils";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

const NavBar = () => {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <header className="fixed top-0 z-50 w-full bg-(--bg-primary)">
      <div className="wrapper navbar-height flex items-center justify-between py-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-0.5">
          <Image
            src="/assets/logo.png"
            alt="Bookidy"
            width={30}
            height={30}
            priority
          />
          <span className="logo-text">Bookidy</span>
        </Link>

        {/* Navigation */}
        <nav className="flex w-fit items-center gap-7.5">

          {navItems.map(({ label, href }) => {
            const isActive =
              pathname === href ||
              (href !== "/" && pathname.startsWith(`${href}/`));

            return (
              <Link
                href={href}
                key={label}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "nav-link-base",
                  isActive
                    ? "nav-link-active"
                    : "text-foreground hover:opacity-70"
                )}
              >
                {label}
              </Link>
            );
          })}

          {/* Authentication */}
            <div className="flex gap-5 items-center">
                <Suspense>
                    <Show when="signed-out">
                        <SignInButton/>
                    </Show>
                    <Show when="signed-in">
                        <div className="nav-user-link">
                            <UserButton />
                            { user?.firstName && (
                                <Link href='/subscriptions' className="nav-user-name">
                                    {user.firstName}
                                </Link>
                            )}
                        </div>
                    </Show>
                </Suspense>
            </div>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
