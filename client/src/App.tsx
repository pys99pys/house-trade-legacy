import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RecoilRoot } from "recoil";

import Layout from "./layouts/layout/Layout";
import HouseTradeListPage from "./pages/house-trade-list-page/HouseTradeListPage";

function App() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <RecoilRoot>
        <Layout>
          <HouseTradeListPage />
        </Layout>
      </RecoilRoot>
    </QueryClientProvider>
  );
}

export default App;
