import { PlantProvider } from "./state/PlantContext"
import { SplitStage } from "./components/SplitStage"

export function App() {
  return (
    <PlantProvider>
      <SplitStage />
    </PlantProvider>
  )
}
