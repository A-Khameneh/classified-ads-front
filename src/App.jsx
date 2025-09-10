import { BrowserRouter } from "react-router-dom";
import Router from "./router/Router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";

import defaultOptions from "./configs/reactQueryConfigs";
import Layout from "layouts/Layout";
import SupportChat from "./components/templates/SupportChat";
import { ChatProvider } from "./context/ChatContext";

function App() {

  const queryClient = new QueryClient({ defaultOptions });

  return (

    <ChatProvider>

      <QueryClientProvider client={queryClient} >

        <BrowserRouter>

          <Layout>

            <Router />

            <Toaster />

            <SupportChat />

          </Layout>

        </BrowserRouter>

        <ReactQueryDevtools />

      </QueryClientProvider>
      
    </ChatProvider>

  )
}

export default App;
