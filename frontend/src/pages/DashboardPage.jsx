import { useEffect, useState } from 'react'

import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import InlineMessage from '../components/InlineMessage'
import LoadingState from '../components/LoadingState'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'
import SubjectCard from '../components/SubjectCard'
import { getExams } from '../services/examService'
import { getStudyTimeStats } from '../services/statsService'
import { getSubjects } from '../services/subjectService'
import { formatDateTime } from '../utils/dates'
import { subjectNameById } from '../utils/labels'

function DashboardPage({ user, onNavigate }) {
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [stats, setStats] = useState(null)
  const [exams, setExams] = useState([])
  const [subjects, setSubjects] = useState([])

  useEffect(() => {
    let isMounted = true

    Promise.all([getStudyTimeStats(), getExams({ upcoming: true }), getSubjects()])
      .then(([statsResult, examsResult, subjectsResult]) => {
        if (!isMounted) return
        setStats(statsResult)
        setExams(examsResult)
        setSubjects(subjectsResult)
        setStatus('ready')
      })
      .catch((loadError) => {
        if (!isMounted) return
        setError(loadError.message)
        setStatus('error')
      })

    return () => {
      isMounted = false
    }
  }, [])

  if (status === 'loading') return <LoadingState label="Cargando inicio..." />
  if (status === 'error') return <InlineMessage>{error}</InlineMessage>

  const highlightedSubjects = subjects.filter((subject) => subject.favorita || subject.prioritaria)

  return (
    <div className="stack-lg">
      <PageHeader title={`Hola, ${user?.nombre || 'estudiante'}`}>
        <Button onClick={() => onNavigate('sessions')}>Nueva sesión</Button>
      </PageHeader>

      <section className="card stack">
        <h2 className="section-title">Tiempo de estudio</h2>
        {stats?.totalSesiones ? (
          <>
            <p>{stats.totalMinutos} minutos en {stats.totalSesiones} sesiones completadas.</p>
            <ul className="list">
              {stats.porMateria.map((item) => (
                <li key={item.materiaId}>{item.materia}: {item.minutos} min ({item.sesiones} sesiones)</li>
              ))}
            </ul>
          </>
        ) : (
          <EmptyState title="Todavía no hay estadísticas">
            Completá una sesión de estudio para ver tus minutos por materia.
          </EmptyState>
        )}
      </section>

      <section className="card stack">
        <h2 className="section-title">Próximos exámenes</h2>
        {exams.length === 0 ? (
          <EmptyState title="No hay exámenes próximos">
            Cargá fechas desde Calendario para ver recordatorios acá.
          </EmptyState>
        ) : (
          <ul className="list">
            {exams.map((exam) => (
              <li key={exam.id} className="row">
                <StatusBadge label="Examen" tone="examen" />
                <span>{exam.titulo}</span>
                <span className="muted">{subjectNameById(subjects, exam.materiaId)}</span>
                <span>{formatDateTime(exam.fecha)}</span>
              </li>
            ))}
          </ul>
        )}
        <Button variant="secondary" onClick={() => onNavigate('calendar')}>Gestionar en calendario</Button>
      </section>

      <section className="stack">
        <h2 className="section-title">Materias destacadas</h2>
        {highlightedSubjects.length === 0 ? (
          <EmptyState title="Sin favoritas ni prioritarias">
            Marcá materias desde la sección Materias.
          </EmptyState>
        ) : (
          <ul className="list">
            {highlightedSubjects.map((subject) => (
              <li key={subject.id}><SubjectCard subject={subject} /></li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

export default DashboardPage
