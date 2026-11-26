export default function StatusBadge({ statut }) {
  const className =
    statut === 'Actif' ? 'badge badge-success'
      : statut === 'Diplômé' ? 'badge badge-info'
        : 'badge badge-warning'

  return <span className={className}>{statut}</span>
}
