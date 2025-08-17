import fetch from "node-fetch";

export async function validateInstrument(
  symbol: string,
  type: "stock" | "fund"
): Promise<boolean> {
  if (type === "stock") {
    const headers = new Headers();
    headers.append("Authorization", "Bearer " + process.env.BR_API_TOKEN);
    const res = await fetch(`https://brapi.dev/api/quote/${symbol}`, {headers});
    console.log(res)
    if (!res.ok) return false;
    const data = await res.json();
    return data?.results?.length > 0;
  }
  if (type === "fund") {
    //checar
  }
  return false;
}
