import { useBabies, useCreateBaby, useDeleteBaby } from "@/hooks/use-babies";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBabySchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Trash2, Plus, Baby } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { Link } from "wouter";

export default function ManageBabies() {
  const { data: babies, isLoading } = useBabies();
  const { mutate: deleteBaby } = useDeleteBaby();
  const { mutate: createBaby, isPending } = useCreateBaby();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(insertBabySchema),
    defaultValues: {
      name: "",
      gender: "boy",
      birthDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    },
  });

  function onSubmit(data: any) {
    createBaby({
        ...data,
        birthDate: new Date(data.birthDate), // Convert string to Date
    }, {
        onSuccess: () => {
            setIsDialogOpen(false);
            form.reset();
        }
    });
  }

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="font-display text-3xl font-bold text-foreground">My Babies</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" /> Add Baby
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Baby</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Baby's name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="boy">Boy</SelectItem>
                          <SelectItem value="girl">Girl</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Birth Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Creating..." : "Create Profile"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {babies?.map((baby) => (
          <Card key={baby.id} className="rounded-3xl border-sage-light shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 pb-8">
               <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-3xl mx-auto mb-2">
                 {baby.gender === 'girl' ? '👧' : baby.gender === 'boy' ? '👦' : '👶'}
               </div>
               <CardTitle className="text-center font-display text-xl">{baby.name}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground text-sm mb-4">
                Born: {format(new Date(baby.birthDate), "MMMM d, yyyy")}
              </p>
               <Link href={`/babies/${baby.id}/feeding`}>
                <Button variant="outline" className="w-full rounded-xl border-primary/20 text-primary hover:bg-primary/5">
                  View Logs
                </Button>
               </Link>
            </CardContent>
            <CardFooter className="border-t border-sage-light/30 bg-gray-50/50 flex justify-end p-4">
               <Button 
                variant="ghost" 
                size="sm" 
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => {
                    if (confirm("Are you sure? This will delete all logs for this baby.")) {
                        deleteBaby(baby.id);
                    }
                }}
               >
                 <Trash2 className="w-4 h-4 mr-2" /> Delete
               </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
