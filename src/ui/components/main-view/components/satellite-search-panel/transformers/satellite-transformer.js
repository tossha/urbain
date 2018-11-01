export function satelliteTransformer(data) {
    return {
        noradId: data["norad_id"],
        objectType: data["object_type"],
        intlDes: data["intl_des"],
        name: data["name"],
        country: data["country"],
        launchDate: data["launch_date"],
        decayDate: data["decay_date"],
        launchSite: data["launch_site"],
        period: data["period"],
        inc: data["inc"],
        apogee: data["apogee"],
        perigee: data["perigee"],
        launchYear: data["launch_year"],
        launchNum: data["launch_num"],
        launchPiece: data["launch_piece"],
        objectName: data["object_name"],
        objectId: data["object_id"],
        objectNumber: data["object_number"],
    };
}
