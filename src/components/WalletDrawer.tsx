import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function WalletDrawer() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Wallet className="h-4 w-4" />
          Wallet
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Wallet</SheetTitle>
          <SheetDescription>
            Connect your wallet to start trading
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            Wallet connection coming soon...
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
