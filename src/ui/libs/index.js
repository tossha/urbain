import { library } from "@fortawesome/fontawesome-svg-core";
import { faExpand, faPlay, faPause, faChevronDown, faCheck, faBars } from "@fortawesome/free-solid-svg-icons";
import { faTelegram, faGithub } from "@fortawesome/fontawesome-free-brands";

export function configureLibs() {
    library.add(faExpand);
    library.add(faPlay);
    library.add(faPause);
    library.add(faChevronDown);
    library.add(faCheck);
    library.add(faBars);
    library.add(faGithub);
    library.add(faTelegram);
}
