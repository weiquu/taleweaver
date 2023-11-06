from datetime import datetime

def to_iso_format(epoch_time):
    """Converts epoch timestamp to ISO format date-time string."""
    if epoch_time:
        return datetime.utcfromtimestamp(epoch_time).isoformat()
    return None