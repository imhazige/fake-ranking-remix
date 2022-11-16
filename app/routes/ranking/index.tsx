import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import _ from "lodash";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { getNoteListItems } from "~/models/note.server";
import { fakeRanking } from "~/ranking.utils";

let _players = [];

export async function loader({ request }: LoaderArgs) {
  _players = fakeRanking();
  return json({players:_players});
}

export async function action({ request }: ActionArgs) {
  _players = fakeRanking();
  return json({});
}

export default function NotesPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Ranking</Link>
        </h1>
        
      </header>

      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
        <Form method="post">
          <button
            type="submit"
            className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Fake
          </button>
        </Form>


         
        </div>

        <div className="flex-1 p-6">
        {data.players.length === 0 ? (
            <p className="p-4">No notes yet</p>
          ) : (
            <ol>
              {data.players.map((player) => (
                <li key={player._id}>
                    {player.name} {player.change}
                </li>
              ))}
            </ol>
          )}
        </div>
      </main>
    </div>
  );
}
