import Card from "../common/Card";
import { useTheme } from "../../context/ThemeContext";

export default function WelcomeCard(){

const { isLight } = useTheme();

const user=JSON.parse(
localStorage.getItem("user")
);

return(

<Card className="
bg-gradient-to-r from-emerald-500 to-cyan-500
rounded-3xl
">

<h1 className={`text-4xl font-bold ${isLight ? "text-slate-900" : "text-white"}`}>

Welcome Back 👋

</h1>

<p className={`mt-4 text-lg ${isLight ? "text-slate-900/90" : "text-white/90"}`}>

{user?.name}

</p>

<p className={isLight ? "mt-4 text-slate-900/85" : "mt-4 text-white/85"}>

Let's crush today's fitness goal!

</p>

</Card>

)

}