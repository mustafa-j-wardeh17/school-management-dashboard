"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LoginPage = () => {
    const { isLoaded, isSignedIn, user } = useUser();

    const router = useRouter();
    useEffect(() => {
        const role = user?.publicMetadata.role;

        if (role) {
            router.push(`/${role}`);
        }
    }, [user, router]);

    return (
        <div className="h-screen relative flex items-center justify-center bg-mSkyLight">
            {
                !isSignedIn && (
                    <>
                        <LoginHint />

                        <SignIn.Root>
                            <SignIn.Step
                                name="start"
                                className="bg-white p-12 rounded-md shadow-2xl flex flex-col gap-2"
                            >
                                <h1 className="text-xl font-bold flex items-center gap-2">
                                    <Image src="/web-app-manifest-512x512.png" alt="" width={24} height={24} />
                                    SchoolPs
                                </h1>
                                <h2 className="text-gray-400">Sign in to your account</h2>
                                <Clerk.GlobalError className="text-sm text-red-400" />
                                <Clerk.Field name="identifier" className="flex flex-col gap-2">
                                    <Clerk.Label className="text-xs text-gray-500">
                                        Username
                                    </Clerk.Label>
                                    <Clerk.Input
                                        type="text"
                                        required
                                        className="p-2 rounded-md ring-1 ring-gray-300"
                                    />
                                    <Clerk.FieldError className="text-xs text-red-400" />
                                </Clerk.Field>
                                <Clerk.Field name="password" className="flex flex-col gap-2">
                                    <Clerk.Label className="text-xs text-gray-500">
                                        Password
                                    </Clerk.Label>
                                    <Clerk.Input
                                        type="password"
                                        required
                                        className="p-2 rounded-md ring-1 ring-gray-300"
                                    />
                                    <Clerk.FieldError className="text-xs text-red-400" />
                                </Clerk.Field>
                                <SignIn.Action
                                    submit
                                    className="bg-blue-500 text-white flex items-center justify-center my-1 rounded-md text-sm p-[10px]"
                                >
                                    {
                                        !isSignedIn
                                            ? ("Sign In")
                                            : (
                                                <div className="flex items-center gap-2">
                                                    <p>Signing in</p>
                                                    <div className="w-5 h-5 border-white border-t-2 rounded-full animate-spin" />
                                                </div>
                                            )
                                    }
                                </SignIn.Action>
                            </SignIn.Step>
                        </SignIn.Root>
                    </>
                )
            }

        </div>
    );
};

import React from 'react';

const LoginHint = () => {
    return (
        <div className="absolute bottom-10 450:right-10 450:translate-x-0 translate-x-1/2 right-1/2 md:right-16 bg-white/90 backdrop-blur-md p-3 rounded-lg shadow-lg 450:w-[310px] w-[280px]">
            <p className="text-center text-gray-800 font-semibold mb-2">Test User Credentials</p>
            <ul className="text-gray-600 450:text-sm text-xs grid grid-cols-2 gap-2">
                <li>
                    <strong>Admin:</strong>
                    <br />
                    <code>admin2 / admin10h</code>
                </li>
                <li>
                    <strong>Teacher:</strong>
                    <br />
                    <code>teacher7 / teacher</code>
                </li>
                <li>
                    <strong>Parent:</strong>
                    <br />
                    <code>parent17 / parent</code>
                </li>
                <li>
                    <strong>Student:</strong>
                    <br />
                    <code>student1 / student</code>
                </li>
            </ul>
        </div>
    );
};



export default LoginPage;