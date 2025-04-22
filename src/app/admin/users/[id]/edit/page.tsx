import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";

export const metadata = {
  title: "Edit User | Frontend Leeds",
  description: "Edit user details",
};

interface EditUserPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditUserPage(props: EditUserPageProps) {
  const params = await props.params;
  const session = await getServerSession(authOptions);

  // Check if user is authenticated and is an admin
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/signin?callbackUrl=/admin/users");
  }

  // Fetch the user
  const user = await prisma.user.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">User Not Found</h1>
          <p className="mb-4 text-gray-700 dark:text-gray-300">The user you are looking for does not exist.</p>
          <Link href="/admin/users">
            <Button>Back to Users</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Edit User</h1>
        
        <form action={`/api/admin/users/${user.id}`} method="POST">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <Input
                type="text"
                id="name"
                name="name"
                defaultValue={user.name || ""}
                className="mt-1"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                defaultValue={user.email || ""}
                className="mt-1"
              />
            </div>
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Role
              </label>
              <select
                id="role"
                name="role"
                defaultValue={user.role}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 sm:text-sm rounded-md"
              >
                <option value={Role.USER}>User</option>
                <option value={Role.ADMIN}>Admin</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Link href="/admin/users">
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button type="submit">Save Changes</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
