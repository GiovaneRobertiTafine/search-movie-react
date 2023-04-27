import { useEffect, useState } from "react";
import { fetchProviders } from "../../services";
import "./onde-assistir.component.scss";

export interface OndeAssistir {
    idFilme: string;
}

function OndeAssistirComponent({ idFilme }: OndeAssistir) {
    const [providers, setProviders] = useState<[]>(null);

    useEffect(() => {
        getProviders(idFilme);
    }, [idFilme]);

    const getProviders = async (idFilme: string) => {
        try {
            const newTodos: any = await fetchProviders(idFilme);
            setProviders(newTodos.results["BR"]);
            console.log(providers);
        } catch (err) { }
    };

    return (
        <div className="box-onde-assistir">
            {
                providers?.['buy'] &&
                <div className="box-providers">
                    <h4>Buy:</h4>
                    {
                        providers?.['buy'].map((v) => {
                            return (
                                <div className="thumb-providers" key={v} style={{ backgroundImage: "url(https://www.themoviedb.org/t/p/original" + v.logo_path + ")" }} />
                            );
                        })
                    }
                </div>
            }
            {
                providers?.['rent'] &&
                <div className="box-providers">
                    <h4>Rent:</h4>
                    {
                        providers?.['rent'].map((v) => {
                            return (
                                <div className="thumb-providers" key={v} style={{ backgroundImage: "url(https://www.themoviedb.org/t/p/original" + v.logo_path + ")" }} />
                            );
                        })
                    }
                </div>
            }
            {
                providers?.['flatrate'] &&
                <div className="box-providers">
                    <h4>Flatrate:</h4>
                    {
                        providers?.['flatrate'].map((v) => {
                            return (
                                <div className="thumb-providers" key={v} style={{ backgroundImage: "url(https://www.themoviedb.org/t/p/original" + v.logo_path + ")" }} />
                            );
                        })
                    }
                </div>
            }
        </ div>
    );
}

export default OndeAssistirComponent;