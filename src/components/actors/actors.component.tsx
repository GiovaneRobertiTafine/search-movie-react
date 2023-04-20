import "./actors.component.scss";

export interface Actors {
    filme: any;
    creditos: any;
    voltarModal: () => void;
}

function ActorsComponent({ filme, creditos, voltarModal }: Actors) {
    return (
        <div>
            <button id="modal-actors-voltar" onClick={() => voltarModal()}>
                Voltar
            </button>
            <div className="box-info-filmes">
                <div className="thumb-filme" style={{ backgroundImage: "url(https://image.tmdb.org/t/p/w780" + filme.poster_path + ")" }} />
                <h2>{filme.title}</h2>
            </div>
        </div>
    );
}

export default ActorsComponent;