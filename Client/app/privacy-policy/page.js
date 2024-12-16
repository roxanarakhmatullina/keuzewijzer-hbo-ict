'use client'
import React from 'react'
import Logo from "@/icons/logo";
import {useGoogleAnalytics} from "@/hooks";

const PrivacyPolicyPage = () => {
    const {setShowModal} = useGoogleAnalytics();

    return (
        <div className={"w-full h-full flex flex-col bg-[#fff] items-center justify-center p-[20px] box-border"}>
            <div className={"w-full max-w-[768px] bg-[#f3f3f3] rounded-[12px] p-[20px] box-border flex justify-center align-middle items-center flex-col gap-[10px]"}>
                <Logo />
                <h1 className={"w-full text-[18px] font-bold"}>Privacyverklaring Keuzewijzer HBO-ICT</h1>
                <div>
                    <span className={"text-[#999]"}>Laatst bijgewerkt: 15-12-2024</span>
                    <br/>
                    <br/>
                    Bij keuzewijzerhboict.nl hechten we veel waarde aan jouw privacy en de bescherming van jouw
                    persoonsgegevens. In deze privacyverklaring leggen we uit welke gegevens we verzamelen, waarom we
                    deze verzamelen en hoe we omgaan met jouw gegevens.
                    <br/>
                    <br/>
                    <h2 className={"text-[16px] font-bold"}>1. Verantwoordelijke</h2>
                    De website keuzewijzerhboict.nl wordt beheerd door Windesheim. Voor vragen
                    over deze privacyverklaring kun je contact opnemen via <a href={"https://www.windesheim.nl"}>Windesheim.nl</a>.
                    <br/>
                    <br/>
                    <h2 className={"text-[16px] font-bold"}>2. Welke gegevens verzamelen we?</h2>
                    Tijdens je bezoek aan onze website verzamelen we via Google Analytics geanonimiseerde gegevens over
                    jouw gebruik van de website. Dit omvat:
                    <ul className={"list-disc ml-5"}>
                        <li>Het IP-adres (geanonimiseerd);</li>
                        <li>Bezochte pagina’s;</li>
                        <li>Tijdstip en duur van het bezoek;</li>
                        <li>Gebruikte browser en apparaat;</li>
                        <li>Verwijzende websites (indien van toepassing).</li>
                    </ul>
                    <br/>
                    <h2 className={"text-[16px] font-bold"}>3. Waarom verzamelen we deze gegevens?</h2>
                    Wij gebruiken deze gegevens uitsluitend om:
                    <ul className={"list-disc ml-5"}>
                        <li>Het gebruik van onze website te analyseren;</li>
                        <li>De functionaliteit en gebruiksvriendelijkheid van onze website te verbeteren;</li>
                        <li>Inzicht te krijgen in welke onderdelen van de website het meest relevant zijn voor onze
                            bezoekers.
                        </li>
                    </ul>
                    <br/>
                    <h2 className={"text-[16px] font-bold"}>4. Google Analytics</h2>
                    Wij maken gebruik van Google Analytics om inzicht te krijgen in het gebruik van onze website.
                    <ul className={"list-disc ml-5"}>
                        <li>Geanonimiseerde IP-adressen: Wij hebben de IP-anonimiseringsfunctie van Google Analytics
                            ingeschakeld. Hierdoor wordt het laatste octet van je IP-adres verwijderd voordat het wordt
                            opgeslagen.
                        </li>
                        <li>Geen delen met derden: Wij hebben een verwerkingsovereenkomst afgesloten met Google, waarin
                            is vastgelegd dat gegevens niet mogen worden gedeeld met derden.
                        </li>
                        <li>Geen gebruik van cookies voor advertenties: Wij gebruiken Google Analytics uitsluitend voor
                            analytische doeleinden en maken geen gebruik van advertentiefuncties.
                        </li>
                    </ul>
                    <br/>
                    <h2 className={"text-[16px] font-bold"}>5. Cookies</h2>
                    Google Analytics plaatst cookies om deze analyses mogelijk te maken. Bij je eerste bezoek aan onze
                    website vragen we expliciet toestemming voor het plaatsen van cookies via onze cookiebanner.
                    Je kunt cookies beheren of verwijderen via de instellingen van je browser. Houd er rekening mee dat
                    het verwijderen of uitschakelen van cookies gevolgen kan hebben voor de functionaliteit van onze
                    website.
                    <br/>
                    <div style={{ overflowX: "auto", margin: "20px 0" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                            <thead>
                            <tr style={{ backgroundColor: "#f3f3f3", borderBottom: "2px solid #ddd" }}>
                                <th style={{ padding: "8px", border: "1px solid #ddd" }}>Cookie</th>
                                <th style={{ padding: "8px", border: "1px solid #ddd" }}>Type</th>
                                <th style={{ padding: "8px", border: "1px solid #ddd" }}>Doel</th>
                                <th style={{ padding: "8px", border: "1px solid #ddd" }}>Bewaartermijn</th>
                                <th style={{ padding: "8px", border: "1px solid #ddd" }}>Aanbieder</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td style={{ padding: "8px", border: "1px solid #ddd" }}>_ga</td>
                                <td style={{ padding: "8px", border: "1px solid #ddd" }}>Analytisch</td>
                                <td style={{ padding: "8px", border: "1px solid #ddd" }}>Gebruikt om gebruikers te onderscheiden</td>
                                <td style={{ padding: "8px", border: "1px solid #ddd" }}>2 jaar</td>
                                <td style={{ padding: "8px", border: "1px solid #ddd" }}>Google Analytics</td>
                            </tr>
                            <tr>
                                <td style={{ padding: "8px", border: "1px solid #ddd" }}>_gid</td>
                                <td style={{ padding: "8px", border: "1px solid #ddd" }}>Analytisch</td>
                                <td style={{ padding: "8px", border: "1px solid #ddd" }}>Gebruikt om sessies te onderscheiden</td>
                                <td style={{ padding: "8px", border: "1px solid #ddd" }}>24 uur</td>
                                <td style={{ padding: "8px", border: "1px solid #ddd" }}>Google Analytics</td>
                            </tr>
                            <tr>
                                <td style={{ padding: "8px", border: "1px solid #ddd" }}>_gat</td>
                                <td style={{ padding: "8px", border: "1px solid #ddd" }}>Analytisch</td>
                                <td style={{ padding: "8px", border: "1px solid #ddd" }}>Wordt gebruikt om het aantal verzoeken te beperken</td>
                                <td style={{ padding: "8px", border: "1px solid #ddd" }}>1 minuut</td>
                                <td style={{ padding: "8px", border: "1px solid #ddd" }}>Google Analytics</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <br/>
                    <h2 className={"text-[16px] font-bold"}>6. Hoe lang bewaren we je gegevens?</h2>
                    De gegevens verzameld via Google Analytics worden maximaal 14 maanden bewaard en daarna automatisch
                    verwijderd.
                    <br/>
                    <br/>
                    <h2 className={"text-[16px] font-bold"}>7. Jouw rechten</h2>
                    Je hebt het recht om:
                    <ul className={"list-disc ml-5"}>
                        <li>Inzage te vragen in de gegevens die we over jou verzamelen;</li>
                        <li>Onjuiste gegevens te laten corrigeren of te laten verwijderen;</li>
                        <li>Bezwaar te maken tegen het gebruik van jouw gegevens.</li>
                    </ul>
                    Om een van deze rechten uit te oefenen, kun je contact met ons opnemen via <a
                    href={"https://www.windesheim.nl/"}>Windesheim</a>.
                    <br/>
                    <br/>
                    <h2 className={"text-[16px] font-bold"}>8. Wijzigingen in deze privacyverklaring</h2>
                    Wij behouden ons het recht voor om deze privacyverklaring te wijzigen. Controleer deze pagina
                    regelmatig voor updates.
                    <br/>
                    <br/>
                    <h2 className={"text-[16px] font-bold"}>9. Contact</h2>
                    Voor vragen of klachten over de verwerking van jouw gegevens kun je contact met ons opnemen via:
                    <ul className={"list-disc ml-5"}>
                        <li><a href={"https://www.windesheim.nl/"}>Windesheim</a>.</li>
                    </ul>
                </div>
                <div className={"w-full flex justify-start align-middle items-center flex-row gap-[10px]"}>
                    <p>Cookies aanpassen: </p>
                    <button
                        onClick={() => setShowModal(true)}
                        className={"w-auto min-w-[100px] h-[40px] bg-[#999] text-black rounded-[8px] p-[10px] box-border flex justify-center align-middle items-center"}>Cookiebeleid
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PrivacyPolicyPage;