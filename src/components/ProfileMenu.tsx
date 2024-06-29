// ProfileMenu.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import {AuthUser} from "aws-amplify/auth";
import {Badge} from "@/components/ui/badge.tsx";


interface ProfileMenuProps {
    user: AuthUser | undefined;
    signOut: () => void;
    isPro: boolean;
}

export function ProfileMenu({ user, signOut, isPro }: ProfileMenuProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder-avatar.jpg" alt={user?.signInDetails?.loginId} />
                        <AvatarFallback>{user?.signInDetails?.loginId?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">Logged in as</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user?.signInDetails?.loginId}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuItem>
                    <div className="flex mt-2">
                        <p>Plan:</p>
                        <Badge variant={isPro ? "default" : "secondary"}>
                            {isPro ? "Pro" : "Standard"}
                        </Badge>
                    </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem onClick={signOut}>
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}