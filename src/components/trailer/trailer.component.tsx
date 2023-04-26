import { useEffect, useState } from "react";
import { fetchVideos } from "../../services";
import "./trailer.component.scss";

export interface Trailer {
    idFilme: number;
    playerTrailer: (idTrailer: string) => void;
}

function TrailerComponent({ idFilme, playerTrailer }: Trailer) {
    const [idVideos, setIdVideos] = useState<string[]>([]);
    const [player, setPlayer] = useState<string>(null);
    useEffect(() => {
        getVideos(idFilme);
    }, [idFilme]);

    const getVideos = async (idFilme: number) => {
        try {
            const newTodos: any = await fetchVideos(idFilme);
            const key = (newTodos.results as []).filter((v) => v['site'] === 'YouTube' && v['type'] === "Trailer").map((v) => v['key']);
            setIdVideos(key);
        } catch (err) { }
    };

    return (
        <>
            {
                !player ?
                    <div className="box-videos">
                        {idVideos.map((v) => {
                            return (
                                <div key={v} className="video-container" style={{ backgroundImage: "url('https://i.ytimg.com/vi/" + v + "/hqdefault.jpg')" }}>
                                    <div onClick={() => playerTrailer(v)} data-site="YouTube" data-id={v} data-title="Trailer">
                                        <div className="box-play">
                                            <div className="play"></div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div> :
                    <div style={{ width: "100%", height: "0", backgroundColor: "#303030", position: "relative", top: "0", paddingBottom: "56.25%", overflow: "hidden" }}>
                        <button id="modal-trailer-voltar" onClick={() => setPlayer(null)}>
                            Voltar
                        </button>
                        <iframe frameBorder="0" width="800" height="400" style={{ position: "absolute", bottom: "0", left: "50%", transform: "translate(-50%, 0)", width: "100%", height: "90%" }}
                            src={"https://www.youtube.com/embed/" + player + "?autoplay=1"} >
                        </iframe>
                    </div >
            }
        </>
    );
}

export default TrailerComponent;