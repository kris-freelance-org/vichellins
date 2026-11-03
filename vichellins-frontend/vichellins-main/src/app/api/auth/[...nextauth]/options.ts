import routes from "@/lib/routes";
import { ISession, IUser } from "@/types/users";
import axios, { AxiosError } from "axios";
import { Account, Profile, Session, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
        type: {},
      },
      async authorize(credentials) {
        try {
          const { data } =
            credentials?.type == "admin"
              ? await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin-auth/login`,
                {
                  email: credentials?.email,
                  password: credentials?.password,
                }
              )
              : await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/login`,
                {
                  email: credentials?.email,
                  password: credentials?.password,
                }
              );

          console.log({ data });
          if (!data) {
            return null;
          }

          return {
            token: data.token,
            details: credentials?.type == "admin" ? data.admin : data.user,
          } as User;

        } catch (error) {

          console.log({ error });
          debugger;

          if (error instanceof AxiosError) {
            throw new Error(
              error.response?.data?.message ||
              error.response?.statusText ||
              "Could not Authenticate user"
            );
          }

          throw new Error("Could not Authenticate user");
        }
      },
    }),
  ],

  pages: {
    signIn: routes.login,
    error: routes.error
  },

  callbacks: {
    async jwt({
      user,
      token,
      trigger,
      session,
    }: {
      token: JWT;
      user: AdapterUser | IUser;
      account: Account | null;
      profile?: Profile | undefined;
      trigger?: "update" | "signIn" | "signUp" | undefined;
      isNewUser?: boolean | undefined;
      session?: ISession;
    }) {
      // Persist the OAuth access_token to the token right after signin
      if (user) {
        token.token = user.token;
        token.user = {
          name: user.details.name,
          email: user.details.email,
          role: user.details?.role,
          phone: user.details.phone,
          id: user.details.id,
        };
      }

      if (trigger === "update" && session?.user) {
        token.user = {
          name: session.user.name,
          email: session.user.email,
          phone: session.user.phone,
          role: user.details?.role,
          id: session.user.id,
        };
      }

      return token;
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      token: ISession;
      user?: AdapterUser; // Optional because not always present
      newSession?: unknown;
      trigger?: "update" | "signIn";
    }) {
      // Send properties to the client, like an access_token from a provider.
      session.token = token.token;
      session.user = token.user;

      return session;
    },
  },
};
