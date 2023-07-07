"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { StatusCodes } from "http-status-codes";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";

import { profileFormSchema } from "@/lib/validators/profile";
import type { ProfileFormValues } from "@/lib/validators/profile";
import { toast } from "@/hooks/useToast";
import { Button } from "@/components/UI/Button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/UI/Form";
import { Input } from "@/components/UI/Input";
import { Textarea } from "@/components/UI/Textarea";

interface ProfileFormProps {
  username?: string;
  bio?: string;
  urls?: {
    linkedIn?: string;
    github?: string;
    facebook?: string;
  };
}

const ProfileForm: React.FC<ProfileFormProps> = ({ username, bio, urls }) => {
  const router = useRouter();
  const defaultValues: Partial<ProfileFormValues> = {
    username,
    bio:
      bio ?? "I'm in a college which doesn't teach anything except bakchodi.",
    urls,
  };
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: async (payload: ProfileFormValues) => {
      await axios.patch("/api/user", payload);
    },
    onError: async (error: unknown) => {
      if (
        error instanceof AxiosError &&
        error.response?.status === StatusCodes.UNAUTHORIZED
      ) {
        return router.push("/signin/?unauthorized=1");
      }
      toast({
        title: "Something went wrong",
        description: "It's on us, please try again later",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      router.refresh();
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    },
  });

  const onSubmit = (data: ProfileFormValues) => mutate(data);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 py-4 md:pt-0 lg:max-w-2xl"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name. It can be your real name or a
                pseudonym.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-2">
          <FormField
            control={form.control}
            name="urls.linkedIn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn</FormLabel>
                <FormControl>
                  <Input placeholder="LinkedIn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="urls.github"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Github</FormLabel>
                <FormControl>
                  <Input placeholder="Github" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="urls.facebook"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Facebook</FormLabel>
                <FormControl>
                  <Input placeholder="Facebook" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={isLoading} isLoading={isLoading}>
          Update profile
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
