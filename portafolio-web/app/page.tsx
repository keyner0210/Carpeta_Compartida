import Link from 'next/link'
import { client, urlFor } from '@/sanity/client'

interface Proyecto {
  _id: string;
  titulo: string;
  descripcion: string;
  imagen: any;
  tecnologias?: string[];
  enlace?: string;
  autores?: string[];
  slug: string;
}

async function getProyectos(): Promise<Proyecto[]> {
  const query = `*[_type == "proyecto"]{
    _id,
    titulo,
    descripcion,
    imagen,
    tecnologias,
    enlace,
    autores,
    "slug": slug.current
  }`
  return await client.fetch(query)
}

export default async function Home() {
  const proyectos = await getProyectos()

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-center">Portafolio Colaborativo</h1>
        <p className="text-gray-400 text-center mb-10">Proyectos desarrollados por nuestro equipo</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proyectos.map((proyecto) => (
            <Link key={proyecto._id} href={`/proyectos/${proyecto.slug}`}>
              <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 shadow-lg hover:border-slate-500 transition-all">
                {proyecto.imagen && (
                  <img
                    src={urlFor(proyecto.imagen).width(600).height(400).url()}
                    alt={proyecto.titulo}
                    className="w-full h-48 object-cover"
                  />
                )}

                <div className="p-5">
                  <h2 className="text-xl font-semibold mb-2">{proyecto.titulo}</h2>
                  <p className="text-gray-300 text-sm mb-4">{proyecto.descripcion}</p>

                  {proyecto.tecnologias && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {proyecto.tecnologias.map((tech, index) => (
                        <span key={index} className="bg-gray-700 text-xs px-2 py-1 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {proyecto.autores && (
                    <p className="text-xs text-gray-400 mb-4">
                      <strong>Autores:</strong> {proyecto.autores.join(', ')}
                    </p>
                  )}

                  {proyecto.enlace && (
                    <a
                      href={proyecto.enlace}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-sm text-blue-400 hover:underline"
                    >
                      Ver Proyecto →
                    </a>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}