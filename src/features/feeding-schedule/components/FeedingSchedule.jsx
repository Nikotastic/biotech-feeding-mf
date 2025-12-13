import { useFeedingSchedule } from '../hooks/useFeedingSchedule'

export default function FeedingSchedule() {
  const { schedules, loading, error } = useFeedingSchedule()

  if (loading) {
    return <div className="flex justify-center p-8">Cargando...</div>
  }

  if (error) {
    return <div className="text-red-600 p-4">Error: {error}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Horario de Alimentación</h1>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
          + Nuevo Horario
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries({ Mañana: '06:00', Mediodía: '12:00', Tarde: '18:00', Noche: '22:00' }).map(([time, hour]) => (
          <div key={time} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{time}</h3>
            <p className="text-2xl font-bold text-primary-600 mb-4">{hour}</p>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">🐄 15 animales</p>
              <p className="text-sm text-gray-600">🌾 Concentrado: 5kg</p>
              <p className="text-sm text-gray-600">🥬 Forraje: 10kg</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Alimentaciones Programadas</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Animal</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Horario</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tipo de Alimento</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Cantidad</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {schedules.map((schedule) => (
                <tr key={schedule.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{schedule.animalName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{schedule.time}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{schedule.feedType}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{schedule.quantity} kg</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      {schedule.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}