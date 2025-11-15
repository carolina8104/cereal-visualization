export const DATA_PATH = "../data/data.json"
export let data = []

export async function loadData() {
    const arr = await d3.json(DATA_PATH)
    data = arr
    return data
}