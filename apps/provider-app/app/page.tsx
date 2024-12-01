"use client"
import {Button} from "@repo/ui/components/ui/button";
import {useState} from "react";
import {Calendar} from "@repo/ui/components/ui/calendar";

export default function Home() {
    const [date, setDate] = useState<Date | undefined>(new Date())

    return (
    <div >
      {/*provider app*/}
      <Button variant={"destructive"} >asdf</Button>
        <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
        />
    </div>
  );
}
