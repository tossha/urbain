import { library } from "@fortawesome/fontawesome-svg-core";
import { faExpand, faPlay, faPause, faChevronDown, faCheck } from "@fortawesome/free-solid-svg-icons";

export function configureLibs() {
    library.add(faExpand);
    library.add(faPlay);
    library.add(faPause);
    library.add(faChevronDown);
    library.add(faCheck);
}
