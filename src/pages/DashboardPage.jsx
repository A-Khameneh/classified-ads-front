import AddPost from "components/templates/AddPost";
import PostList from "src/components/templates/PostList";
import UserChatPanel from "src/components/templates/UserChatPanel";


export default function DashboardPage() {

    return <div>

        <AddPost />
        <PostList />
        <UserChatPanel />

    </div>

}