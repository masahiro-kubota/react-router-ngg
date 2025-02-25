import type { Route } from "./+types/team";

export async function loader({ params }: Route.LoaderArgs) {
  //                           ^? { teamId: string }
}

export default function Component({
  params,
}: Route.ComponentProps) {
  params.teamId;
  //        ^ string
}