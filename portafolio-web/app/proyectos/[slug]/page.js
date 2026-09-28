import { client, urlFor } from '@/sanity/client';
import Image from 'next/image';
import Link from 'next/link';

// Consulta GROQ para traer los detalles de un solo proyecto según su slug
async function getProyecto(slug) {
  const query = `*[_type == "proyecto" && slug.current == $slug][0]{
    titulo,
    descripcion,
    contenidoDetallado,
    detallesCompletos,
    github,
    githubUrl,
    enlace,
    imagen,
    tecnologias,
    autores
  }`;
  return await client.fetch(query, { slug });
}

export default async function PaginaProyecto({ params }) {
  const { slug } = await params;
  const proyecto = await getProyecto(slug);

  if (!proyecto) {
    return (
      <main className="min-h-screen bg-slate-900 text-white p-8 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Proyecto no encontrado</h1>
        <Link href="/" className="mt-4 text-blue-400 hover:underline">
          ← Volver al inicio
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Botón Volver */}
        <Link href="/" className="text-blue-400 hover:underline inline-block">
          ← Volver al inicio
        </Link>

        {/* Título */}
        <h1 className="text-4xl font-extrabold text-white">{proyecto.titulo}</h1>

        {/* Tecnologías */}
        {proyecto.tecnologias && (
          <div className="flex flex-wrap gap-2">
            {proyecto.tecnologias.map((tech, i) => (
              <span key={i} className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Imagen Principal */}
       {proyecto.imagen && (
  <div className="relative w-full h-80 md:h-96 rounded-xl overflow-hidden shadow-xl mb-6">
    <img
      src={urlFor(proyecto.imagen).url()}
      alt={proyecto.titulo}
      className="w-full h-full object-cover"
    />
  </div>
)}

        {/* Botón de GitHub */}
{(proyecto.github || proyecto.githubUrl || proyecto.enlace) && (
  <a
    href={proyecto.github || proyecto.githubUrl || proyecto.enlace}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-3 rounded-lg border border-slate-700 transition-all font-medium mb-6"
  >
    💻 Ver Código en GitHub
  </a>
)}

{/* Sección de Detalles del Proyecto */}
<div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 space-y-4">
  <h2 className="text-xl font-bold text-white mb-2">Detalles del Proyecto</h2>
  <div className="whitespace-pre-line text-slate-300 leading-relaxed">
    {proyecto.contenidoDetallado || proyecto.detallesCompletos || proyecto.descripcion}
  </div>
</div>
      </div>
    </main>
  );
}