export interface PlayerTrailer {
    idTrailer: string;
    voltarModal: () => void;
}

function PlayerTrailerComponent({ idTrailer, voltarModal }: PlayerTrailer) {
    return (
        <div>
            <button id="modal-actors-voltar" onClick={() => voltarModal()}>
                Voltar
            </button>
            <div style={{ width: "100%", height: "0", position: "relative", paddingBottom: "56.25%", overflow: "hidden", marginTop: "50px" }}>
                <iframe frameBorder="0" width="800" height="400" style={{ position: "absolute", bottom: "0", left: "50%", transform: "translate(-50%, 0)", width: "100%", height: "100%" }}
                    src={"https://www.youtube.com/embed/" + idTrailer + "?autoplay=1"} >
                </iframe>
            </div >
        </div>
    );
}

export default PlayerTrailerComponent;