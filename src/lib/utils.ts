import { env } from "@/env.mjs";
import { clsx, type ClassValue } from "clsx";
import queryString from "query-string";
import { FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const capitalizeString = (value: string) =>
  value.charAt(0).toUpperCase().concat(value.substring(1, value.length));

export const generateCbUrl = (pathname: string) =>
  queryString.stringifyUrl({
    url: "/signin",
    query: { callbackUrl: pathname },
  });

export const absoluteUrl = (path: string) =>
  `${env.NEXT_PUBLIC_APP_URL}${path}`;

export const extractString = (str: string) => {
  if (str.length <= 75) return str;
  return str.slice(0, 75) + "...";
};

export const generateShareUrl = ({
  title,
  url,
}: {
  title: string;
  url: string;
}) => {
  const twitter = queryString.stringifyUrl({
    url: "https://twitter.com/intent/tweet",
    query: { url, text: title },
  });
  const linkedIn = queryString.stringifyUrl({
    url: "https://www.linkedin.com/sharing/share-offsite",
    query: { url },
  });
  const facebook = queryString.stringifyUrl({
    url: "https://www.facebook.com/dialog/share",
    query: { href: url, display: "popup", app_id: env.NEXT_PUBLIC_FB_APP_ID },
  });
  return [
    { url: twitter, icon: FaTwitter },
    { url: linkedIn, icon: FaLinkedin },
    { url: facebook, icon: FaFacebook },
  ];
};
