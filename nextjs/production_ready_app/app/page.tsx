import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { Event } from "@/database";
import connectDB from "@/lib/mongodb";

const Page = async () => {
  // Connect to database and fetch events directly (Server Component)
  await connectDB();
  const events = await Event.find().sort({ createdAt: -1 }).lean();

  return (
    <section>
      <h1>
        The Hub for Every Dev <br />
        Event You Can&apos;t Miss
      </h1>
      <p>Hackathons,Meetups,and Conferences,All in One Place</p>
      <ExploreBtn />
      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        <ul className="events">
          {events &&
            events.length > 0 &&
            events.map((event) => (
              <li key={event._id.toString()}>
                <EventCard {...event} />
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
};

export default Page;
