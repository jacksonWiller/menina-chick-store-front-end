import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PoliticaPrivacidade = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="font-display text-4xl md:text-5xl font-light mb-8 text-center">Política de Privacidade</h1>
          <div className="space-y-6 font-body text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. Informações Coletadas</h2>
              <p>
                A Menina Chick Boutique coleta apenas as informações necessárias para processar seus pedidos e melhorar sua experiência de compra, como nome, e-mail, telefone e endereço de entrega.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. Uso das Informações</h2>
              <p>
                Suas informações são utilizadas exclusivamente para processar pedidos, enviar atualizações sobre suas compras e, quando autorizado, enviar novidades e promoções.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. Proteção dos Dados</h2>
              <p>
                Adotamos medidas de segurança adequadas para proteger suas informações pessoais contra acesso não autorizado, alteração ou destruição.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. Compartilhamento</h2>
              <p>
                Não compartilhamos suas informações pessoais com terceiros, exceto quando necessário para o processamento de pedidos (como empresas de entrega).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. Seus Direitos</h2>
              <p>
                Você pode solicitar a exclusão ou alteração de seus dados pessoais a qualquer momento entrando em contato conosco pelo WhatsApp.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">6. Contato</h2>
              <p>
                Para dúvidas sobre nossa política de privacidade, entre em contato pelo WhatsApp: 
                <a 
                  href="https://wa.me/553898707072" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline ml-1"
                >
                  (38) 9870-7072
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PoliticaPrivacidade;
