import CategoryForm from "components/templates/CategoryForm";
import CategoryList from "components/templates/CategoryList";
import GetAdmins from "src/components/templates/GetAdmins";
import OptionForm from "src/components/templates/OptionForm";
import SetRole from "src/components/templates/SetRole";


export default function AdminPage() {

    return <div>

        <CategoryForm />
        <CategoryList />
        <SetRole />
        <GetAdmins />
        <OptionForm />

    </div>

}