import pytest
import asyncio
import time
from functools import wraps

def retry_flaky(times=3, delay=0.5):
    """Decorator for potentially flaky tests"""
    def decorator(func):
        @wraps(func)
        async def async_wrapper(*args, **kwargs):
            for i in range(times):
                try:
                    return await func(*args, **kwargs)
                except Exception as e:
                    if i == times - 1:
                        raise
                    await asyncio.sleep(delay)

        @wraps(func)
        def sync_wrapper(*args, **kwargs):
            for i in range(times):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if i == times - 1:
                        raise
                    time.sleep(delay)

        return async_wrapper if asyncio.iscoroutinefunction(func) else sync_wrapper
    return decorator

# Pytest marker for flaky tests
flaky = pytest.mark.flaky(reruns=3, reruns_delay=1)