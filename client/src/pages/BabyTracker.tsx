import { useState } from "react";
import { useRoute, Link, useLocation } from "wouter";
import { useBaby } from "@/hooks/use-babies";
import { useFeedings, useSleepLogs, useDiaperLogs, useGrowthLogs, useMemories, useCreateFeeding, useCreateSleepLog, useCreateDiaperLog, useCreateGrowthLog, useCreateMemory } from "@/hooks/use-logs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Clock, Utensils, Moon, Droplets, Ruler, Heart, Plus, Save } from "lucide-react";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { format } from "date-fns";
import { insertFeedingSchema, insertSleepLogSchema, insertDiaperLogSchema, insertGrowthLogSchema, insertMemorySchema } from "@shared/schema";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function BabyTracker() {
  const [match, params] = useRoute("/babies/:id/:tab?");
  const [, setLocation] = useLocation();
  const id = parseInt(params?.id || "0");
  const tab = params?.tab || "feeding";

  const { data: baby, isLoading } = useBaby(id);

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (!baby) return <div className="p-8">Baby not found</div>;

  const tabs = [
    { id: "feeding", label: "Feeding", icon: Utensils, color: "text-blue-500", bg: "bg-blue-50" },
    { id: "sleep", label: "Sleep", icon: Moon, color: "text-purple-500", bg: "bg-purple-50" },
    { id: "diaper", label: "Diaper", icon: Droplets, color: "text-orange-500", bg: "bg-orange-50" },
    { id: "growth", label: "Growth", icon: Ruler, color: "text-green-500", bg: "bg-green-50" },
    { id: "memories", label: "Memories", icon: Heart, color: "text-pink-500", bg: "bg-pink-50" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#FAF9F6]">
      {/* Header */}
      <div className="bg-white border-b border-sage-light px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-sage-light">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-display font-bold text-xl">{baby.name}</h1>
            <p className="text-xs text-muted-foreground">Born {new Date(baby.birthDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-5xl mx-auto w-full space-y-6">
        {/* Tab Navigation */}
        <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
          {tabs.map((t) => (
            <Link key={t.id} href={`/babies/${id}/${t.id}`}>
              <div 
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer whitespace-nowrap transition-all border
                  ${tab === t.id 
                    ? `bg-white border-primary/20 shadow-md ${t.color}` 
                    : "bg-transparent border-transparent text-muted-foreground hover:bg-white/50"
                  }
                `}
              >
                <div className={`p-1.5 rounded-full ${t.bg}`}>
                  <t.icon className={`w-4 h-4 ${t.color}`} />
                </div>
                <span className="font-medium text-sm">{t.label}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {tab === "feeding" && <FeedingTab babyId={id} />}
          {tab === "sleep" && <SleepTab babyId={id} />}
          {tab === "diaper" && <DiaperTab babyId={id} />}
          {tab === "growth" && <GrowthTab babyId={id} />}
          {tab === "memories" && <MemoriesTab babyId={id} />}
        </motion.div>
      </div>
    </div>
  );
}

// --- TAB COMPONENTS ---

function FeedingTab({ babyId }: { babyId: number }) {
  const { data: feedings } = useFeedings(babyId);
  const { mutate: createFeeding, isPending } = useCreateFeeding();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(insertFeedingSchema.omit({ babyId: true })),
    defaultValues: {
      type: "bottle",
      amount: 0,
      duration: 0,
      side: "both",
      time: new Date().toISOString(),
    },
  });

  function onSubmit(data: any) {
    createFeeding(
      { babyId, ...data, time: new Date(data.time) }, // Zod expects Date object
      { onSuccess: () => setIsOpen(false) }
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold text-foreground">Feeding Log</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20">
              <Plus className="w-4 h-4 mr-2" /> Log Feeding
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Log Feeding</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="breast">Breast</SelectItem>
                          <SelectItem value="bottle">Bottle</SelectItem>
                          <SelectItem value="formula">Formula</SelectItem>
                          <SelectItem value="solids">Solids</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount (ml/g)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Saving..." : "Save Log"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {feedings?.map((log) => (
          <div key={log.id} className="bg-white p-4 rounded-2xl shadow-sm border border-sage-light flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-500">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold capitalize">{log.type}</p>
                <p className="text-sm text-muted-foreground">{log.amount}ml • {log.duration} mins</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-sm">{format(new Date(log.time), "h:mm a")}</p>
              <p className="text-xs text-muted-foreground">{format(new Date(log.time), "MMM d")}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SleepTab({ babyId }: { babyId: number }) {
    const { data: logs } = useSleepLogs(babyId);
    const { mutate: createLog, isPending } = useCreateSleepLog();
    const [isOpen, setIsOpen] = useState(false);
  
    const form = useForm({
      resolver: zodResolver(insertSleepLogSchema.omit({ babyId: true })),
      defaultValues: {
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
      },
    });
  
    function onSubmit(data: any) {
      createLog(
        { babyId, startTime: new Date(data.startTime), endTime: new Date(data.endTime) },
        { onSuccess: () => setIsOpen(false) }
      );
    }
  
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-display font-bold text-foreground">Sleep Log</h2>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full bg-purple-500 hover:bg-purple-600 text-white shadow-lg shadow-purple-500/20">
                <Plus className="w-4 h-4 mr-2" /> Log Sleep
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Log Sleep</DialogTitle></DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sleep Start</FormLabel>
                        <FormControl><Input type="datetime-local" {...field} /></FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Wake Up</FormLabel>
                        <FormControl><Input type="datetime-local" {...field} /></FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isPending}>{isPending ? "Saving..." : "Save Log"}</Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
  
        <div className="space-y-3">
          {logs?.map((log) => (
            <div key={log.id} className="bg-white p-4 rounded-2xl shadow-sm border border-sage-light flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-50 rounded-xl text-purple-500">
                  <Moon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">Sleep Session</p>
                  <p className="text-sm text-muted-foreground">{log.duration} mins total</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-sm">{format(new Date(log.startTime), "h:mm a")} - {log.endTime && format(new Date(log.endTime), "h:mm a")}</p>
                <p className="text-xs text-muted-foreground">{format(new Date(log.startTime), "MMM d")}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

function DiaperTab({ babyId }: { babyId: number }) {
  const { data: logs } = useDiaperLogs(babyId);
  const { mutate: createLog, isPending } = useCreateDiaperLog();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(insertDiaperLogSchema.omit({ babyId: true })),
    defaultValues: { type: "wet", notes: "", time: new Date().toISOString() },
  });

  function onSubmit(data: any) {
    createLog({ babyId, ...data, time: new Date(data.time) }, { onSuccess: () => setIsOpen(false) });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold text-foreground">Diaper Log</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20">
              <Plus className="w-4 h-4 mr-2" /> Log Diaper
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Log Diaper</DialogTitle></DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="wet">Wet</SelectItem>
                          <SelectItem value="dirty">Dirty</SelectItem>
                          <SelectItem value="both">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Time</FormLabel>
                        <FormControl><Input type="datetime-local" {...field} /></FormControl>
                    </FormItem>
                    )}
                />
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (Optional)</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isPending}>{isPending ? "Saving..." : "Save Log"}</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {logs?.map((log) => (
          <div key={log.id} className="bg-white p-4 rounded-2xl shadow-sm border border-sage-light flex flex-col items-center justify-center text-center gap-2">
            <div className={`p-3 rounded-full ${log.type === 'wet' ? 'bg-blue-50 text-blue-500' : 'bg-orange-50 text-orange-500'}`}>
              <Droplets className="w-6 h-6" />
            </div>
            <p className="font-bold capitalize">{log.type}</p>
            <p className="text-xs text-muted-foreground">{format(new Date(log.time), "h:mm a, MMM d")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function GrowthTab({ babyId }: { babyId: number }) {
  const { data: logs } = useGrowthLogs(babyId);
  const { mutate: createLog, isPending } = useCreateGrowthLog();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(insertGrowthLogSchema.omit({ babyId: true })),
    defaultValues: { height: 0, weight: 0, headCircumference: 0, date: new Date().toISOString() },
  });

  function onSubmit(data: any) {
    createLog({ babyId, ...data, date: new Date(data.date) }, { onSuccess: () => setIsOpen(false) });
  }

  const chartData = logs?.map(l => ({
    date: format(new Date(l.date), 'MM/dd'),
    weight: Number(l.weight),
    height: Number(l.height)
  })).reverse() || [];

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold text-foreground">Growth Log</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20">
              <Plus className="w-4 h-4 mr-2" /> Log Growth
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Log Growth</DialogTitle></DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="weight" render={({ field }) => (
                    <FormItem><FormLabel>Weight (kg)</FormLabel><FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="height" render={({ field }) => (
                    <FormItem><FormLabel>Height (cm)</FormLabel><FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl></FormItem>
                    )} />
                </div>
                <FormField control={form.control} name="headCircumference" render={({ field }) => (
                    <FormItem><FormLabel>Head Circ. (cm)</FormLabel><FormControl><Input type="number" step="0.1" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl></FormItem>
                )} />
                 <FormField control={form.control} name="date" render={({ field }) => (
                    <FormItem><FormLabel>Date</FormLabel><FormControl><Input type="datetime-local" {...field} /></FormControl></FormItem>
                )} />
                <Button type="submit" className="w-full" disabled={isPending}>{isPending ? "Saving..." : "Save Log"}</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {chartData.length > 0 && (
        <div className="h-[300px] w-full bg-white p-4 rounded-3xl border border-sage-light shadow-sm">
             <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                    <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#10B981" strokeWidth={3} dot={{r: 4, fill: '#10B981'}} activeDot={{r: 6}} />
                    <Line yAxisId="right" type="monotone" dataKey="height" stroke="#3B82F6" strokeWidth={3} dot={{r: 4, fill: '#3B82F6'}} activeDot={{r: 6}} />
                </LineChart>
            </ResponsiveContainer>
        </div>
      )}

      <div className="space-y-3">
        {logs?.map((log) => (
          <div key={log.id} className="bg-white p-4 rounded-2xl shadow-sm border border-sage-light flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-green-50 rounded-xl text-green-500">
                  <Ruler className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">{log.weight} kg • {log.height} cm</p>
                  <p className="text-sm text-muted-foreground">Head: {log.headCircumference} cm</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{format(new Date(log.date), "MMM d, yyyy")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MemoriesTab({ babyId }: { babyId: number }) {
    const { data: logs } = useMemories(babyId);
    const { mutate: createLog, isPending } = useCreateMemory();
    const [isOpen, setIsOpen] = useState(false);
  
    const form = useForm({
      resolver: zodResolver(insertMemorySchema.omit({ babyId: true })),
      defaultValues: { title: "", description: "", emoji: "❤️", date: new Date().toISOString() },
    });
  
    function onSubmit(data: any) {
      createLog({ babyId, ...data, date: new Date(data.date) }, { onSuccess: () => setIsOpen(false) });
    }
  
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-display font-bold text-foreground">Memories</h2>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="rounded-full bg-pink-500 hover:bg-pink-600 text-white shadow-lg shadow-pink-500/20">
                <Plus className="w-4 h-4 mr-2" /> Add Memory
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Add Memory</DialogTitle></DialogHeader>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem><FormLabel>Description</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                    )} />
                     <FormField control={form.control} name="emoji" render={({ field }) => (
                        <FormItem><FormLabel>Emoji</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                    )} />
                     <FormField control={form.control} name="date" render={({ field }) => (
                        <FormItem><FormLabel>Date</FormLabel><FormControl><Input type="datetime-local" {...field} /></FormControl></FormItem>
                    )} />
                    <Button type="submit" className="w-full" disabled={isPending}>{isPending ? "Saving..." : "Save Memory"}</Button>
                </form>
                </Form>
            </DialogContent>
            </Dialog>
        </div>
  
        <div className="grid md:grid-cols-2 gap-6">
          {logs?.map((log) => (
            <div key={log.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-sage-light hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{log.emoji}</div>
                <h3 className="font-display font-bold text-xl mb-2">{log.title}</h3>
                <p className="text-muted-foreground mb-4">{log.description}</p>
                <p className="text-xs text-sage font-medium uppercase tracking-wider">{format(new Date(log.date), "MMMM d, yyyy")}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
